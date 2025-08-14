import "server-only";

import { prisma } from "./prisma";
import { auth } from "@clerk/nextjs/server";

export type AuthCheckResult = {
  userId: string | null;
  isAuthenticated: boolean;
  hasSubsctiption: boolean;
  redirectUrl: string | undefined;
};

export async function checkAuthenticationAndSubscription(
  waitMs = 0
): Promise<AuthCheckResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      userId: null,
      isAuthenticated: false,
      hasSubsctiption: false,
      redirectUrl: `/sign-in?redirect_url=/dashboard`,
    };
  }

  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  let subscription = null;
  try {
    subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.log("Error fetching subscription", error);
    return {
      userId: userId,
      isAuthenticated: true,
      hasSubsctiption: false,
      redirectUrl: `/pricing`,
    };
  }
  const hasActiveSubscription = subscription?.status === "active";

  return {
    userId: userId,
    isAuthenticated: true,
    hasSubsctiption: true,
    redirectUrl: hasActiveSubscription ? undefined : "/pricing",
  };
}
