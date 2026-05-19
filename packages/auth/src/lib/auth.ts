import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { admin, bearer, captcha, deviceAuthorization, haveIBeenPwned, jwt, lastLoginMethod, multiSession, openAPI, organization, twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { dash, sentinel } from "@better-auth/infra";
import { mailQueue } from "../queue/mail-queue";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth( {
    database: drizzleAdapter( db, {
        provider: "pg", // or "mysql", "sqlite"
    } ),
    rateLimit: {
        window: 10, // time window in seconds
        max: 100, // max requests in the window
    },
    secret:Bun.env.BETTER_AUTH_SECRET!,

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ( { user, url } ) => {
            await mailQueue.add( "password-reset", {
                to: user.email,
                subject: "Reset your password",
                jobType: "password-reset",
                createdAt: Date.now(),
                userId: user.id,
                data: {
                    userName: user.name || "User",
                    resetLink: url,
                    resetCode: "",
                    expiresIn: 30,
                },
            } );
        }, onPasswordReset: async ( { user } ) => {
            await mailQueue.add( "security-alert", {
                to: user.email,
                subject: "Your password has been changed",
                jobType: "security-alert",
                createdAt: Date.now(),
                userId: user.id,
                data: {
                    userName: user.name || "User",
                    alertType: "password-changed",
                    message: "Your password was just changed. If this wasn't you, reset it immediately.",
                    actionLink: `${process.env.APP_URL}/account/security`,
                    actionText: "Review security",
                },
            } );
        },
        onExistingUserSignUp: async ( { user } ) => {
            await mailQueue.add( "security-alert", {
                to: user.email,
                subject: "Account activity notice",
                jobType: "security-alert",
                createdAt: Date.now(),
                data: {
                    userName: user.email.split( "@" )[0],
                    alertType: "stale-user",
                    message: "An account already exists for this email. If this wasn't you, you can ignore this message.",
                },
            } );
        },

    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ( { user, url, token } ) => {
            await mailQueue.add( "email-verification", {
                to: user.email,
                subject: "Verify your email address",
                jobType: "email-verification",
                createdAt: Date.now(),
                userId: user.id,
                data: {
                    userName: user.name || "User",
                    verificationLink: url,
                    verificationCode: token,
                },
            } );
        },
    },
    plugins: [
        twoFactor( {
            otpOptions: {

                sendOTP: async ( { user, otp } ) => {
                    await mailQueue.add( "2fa-verification", {
                        to: user.email,
                        subject: "Your 2FA verification code",
                        jobType: "2fa-verification",
                        createdAt: Date.now(),
                        userId: user.id,
                        data: {
                            userName: user.name || "User",
                            otpCode: otp,
                            expiresIn: 5,
                        },
                    } );
                }
            }
        } ),
        magicLink( {
            sendMagicLink: async ( { email, token, url } ) => {
                await mailQueue.add( "magic-link", {
                    to: email,
                    subject: "Your magic login link",
                    jobType: "magic-link",
                    createdAt: Date.now(),
                    data: {
                        loginLink: url,
                        loginCode: token,
                        expiresIn: 15,
                    },
                } );
            },

        } ),
        dash(),
        passkey(),
        admin(),
        organization( {
            organizationHooks: {
                afterCreateOrganization: async ( { organization, user } ) => {
                    await mailQueue.add( "security-alert", {
                        to: user.email,
                        subject: `Organization created: ${organization.name}`,
                        jobType: "security-alert",
                        createdAt: Date.now(),
                        userId: user.id,
                        data: {
                            userName: user.name || "User",
                            alertType: "org-created",
                            message: `Your organization ${organization.name} is ready.`,
                            actionLink: `${process.env.APP_URL}/org/${organization.slug || organization.id}`,
                            actionText: "Open organization",
                        },
                    } );
                },
                afterAddMember: async ( { user, organization } ) => {
                    await mailQueue.add( "security-alert", {
                        to: user.email,
                        subject: `Added to ${organization.name}`,
                        jobType: "security-alert",
                        createdAt: Date.now(),
                        userId: user.id,
                        data: {
                            userName: user.name || "User",
                            alertType: "org-member-added",
                            message: `You have been added to ${organization.name}.`,
                            actionLink: `${process.env.APP_URL}/org/${organization.slug || organization.id}`,
                            actionText: "View organization",
                        },
                    } );
                },
                afterAcceptInvitation: async ( { user, organization } ) => {
                    await mailQueue.add( "security-alert", {
                        to: organization.ownerEmail,
                        subject: `Invitation accepted: ${organization.name}`,
                        jobType: "security-alert",
                        createdAt: Date.now(),
                        userId: user.id,
                        data: {
                            userName: organization.ownerEmail.split( "@" )[0],
                            alertType: "org-invitation-accepted",
                            message: `${user.name || "A user"} accepted the invitation to join ${organization.name}.`,
                            actionLink: `${process.env.APP_URL}/org/${organization.slug || organization.id}`,
                            actionText: "Open organization",
                        },
                    } );
                },
                afterRemoveMember: async ( { user, organization } ) => {
                    await mailQueue.add( "security-alert", {
                        to: user.email,
                        subject: `Removed from ${organization.name}`,
                        jobType: "security-alert",
                        createdAt: Date.now(),
                        userId: user.id,
                        data: {
                            userName: user.name || "User",
                            alertType: "org-member-removed",
                            message: `You were removed from ${organization.name}.`,
                        },
                    } );
                },
            },
            sendInvitationEmail: async ( { email, role, id, inviter, organization } ) => {
                await mailQueue.add( "org-invitation", {
                    to: email,
                    subject: `You have been invited to join ${organization.name}`,
                    jobType: "org-invitation",
                    createdAt: Date.now(),
                    data: {
                        invitedUserName: email.split( "@" )[0],
                        organizationName: organization.name,
                        inviterName: inviter?.user?.name || "Someone",
                        acceptLink: `${process.env.APP_URL}/org/join?token=${id}`,
                        role: role || "Member",
                    },
                } );
            }
        } ),
        bearer(),
        deviceAuthorization( {
            verificationUri: "/device",
            schema: {
                deviceCode: {
                    modelName: "device_code",
                }

            },
            onDeviceAuthRequest: async ( clientId,scope ) => {
                // You can look up the client by clientId and include client info in the email
               console.log( "Device auth requested for client:", clientId, "with scope:", scope );
            },
        } ),
        // captcha( {
        //     provider: "cloudflare-turnstile", // or google-recaptcha, hcaptcha, captchafox
        //     secretKey: process.env.TURNSTILE_SECRET_KEY!,
        // } ),
        haveIBeenPwned( {
            enabled: process.env.NODE_ENV === 'production',
            customPasswordCompromisedMessage: "Please choose a more secure password."
        } ),
        lastLoginMethod(),
        multiSession( {
            maximumSessions: 10
        } ),
        openAPI(),
        jwt(),
        // sentinel( {
        //     security: {
        //         credentialStuffing: {
        //             enabled: true,
        //             thresholds: {
        //                 challenge: 3,  // Issue PoW challenge after 3 failures
        //                 block: 5,      // Block after 5 failures
        //             },
        //             windowSeconds: 3600,     // 1 hour window
        //             cooldownSeconds: 900,    // 15 minute cooldown after block
        //         },
        //         impossibleTravel: {
        //             enabled: true,
        //             maxSpeedKmh: 1000,    // Max realistic travel speed
        //             action: "challenge",  // "log", "challenge", or "block"
        //         },
        //         freeTrialAbuse: {
        //             enabled: true,
        //             thresholds: {
        //                 challenge: 2,
        //                 block: 3,
        //             },
        //             maxAccountsPerVisitor: 3,
        //             action: "block",
        //         },
        //         compromisedPassword: {
        //             enabled: true,
        //             action: "block",      // "log", "challenge", or "block"
        //             minBreachCount: 1,    // Minimum breaches to trigger
        //         },
        //         staleUsers: {
        //             enabled: true,
        //             staleDays: 90,           // Account considered stale after 90 days
        //             action: "log",           // "log", "challenge", or "block"
        //             notifyUser: true,        // Send email to user
        //             notifyAdmin: true,       // Send email to admin
        //             adminEmail: "admin@yourapp.com",
        //         },
        //         botBlocking: {
        //             action: "challenge",  // "log", "challenge", or "block"
        //         },
        //         suspiciousIpBlocking: {
        //             action: "block",

        //         },
        //         velocity: {
        //             enabled: true,
        //             thresholds: {
        //                 challenge: 10,
        //                 block: 20,
        //             },
        //             maxSignupsPerVisitor: 5,
        //             maxPasswordResetsPerIp: 10,
        //             maxSignInsPerIp: 50,
        //             windowSeconds: 3600,
        //             action: "challenge",
        //         },
        //         emailValidation: {
        //             enabled: true,
        //             strictness: "high",  // "low", "medium", or "high"
        //             action: "block",
        //         },
        //         emailNormalization: {
        //             enabled: true, // still normalize for deduplication and consistent sign-in
        //         },
        //         challengeDifficulty: 20

        //         // Configure security features here
        //     },

        // } ),
    ],
    // emailVerification: {

    // },
    appName: "Agentic Chat",
} );