import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../../config";

const login = async (payload: { email: string; password: string }) => {
  await prisma.user.findUnique({ where: { email: payload.email } });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.JWT_SECRET,
    "1h"
  );
  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.JWT_SECRET,
    "90d"
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const authService = {
  login,
};
