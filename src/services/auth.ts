import argon2 from "argon2";

import { AuthRepository } from "../repository/auth.js";
import { RoleRepository } from "../repository/role.js";
import { ProfileRepository } from "../repository/profile.js";

import { Profile } from "../model/profile.js";
import { Auth } from "../model/auth.js";
import { Role } from "../model/role.js";

type AuthServiceReturn = {
  message: string;
  status: "success" | "error";
  // What the fuck does this line does, who knows.
  user: (Auth & { profile: Profile; role: Role }) | null;
  error?: unknown;
};

type AuthSearchInput = Partial<Pick<Auth, "username" | "id">>;

export class AuthService {
  private authRepo = new AuthRepository();
  private roleRepo = new RoleRepository();
  private profileRepo = new ProfileRepository();

  async createUser(
    input: Pick<Auth, "username" | "password">,
  ): Promise<AuthServiceReturn> {
    try {
      const usernameExists = await this.authRepo.findByUsername(input.username);

      if (usernameExists) {
        return {
          message: "Username already exists!",
          status: "error",
          user: null,
        };
      }

      const hashPassword = await argon2.hash(input.password);

      const user = await this.authRepo.create(input.username, hashPassword);

      if (!user) {
        return {
          message: "Failed to create user",
          status: "error",
          user: null,
        };
      }

      const role = await this.roleRepo.findRoleByName("viewer");

      if (role == null) {
        return {
          message: "Default role not found",
          status: "error",
          user: null,
        };
      }

      const profile = await this.profileRepo.create(user.id, role.id, "");

      return {
        message: "User created successfully",
        status: "success",
        user: {
          ...user,
          profile,
          role,
        },
      };
    } catch (error: unknown) {
      return {
        message: "Internal error in auth create",
        status: "error",
        user: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async findUser(input: AuthSearchInput): Promise<AuthServiceReturn> {
    try {
      let user: Auth | null = null;

      if (input.id) {
        user = await this.authRepo.findByID(input.id);
      } else if (input.username) {
        user = await this.authRepo.findByUsername(input.username);
      } else {
        return {
          message: "No search parameter provided",
          status: "error",
          user: null,
        };
      }

      if (!user) {
        return {
          message: "No user found",
          status: "error",
          user: null,
        };
      }

      const profile: Profile | null = await this.profileRepo.findByUserID(
        user.id,
      );

      if (!profile) {
        return {
          message: "Profile missing for user",
          status: "error",
          user: null,
        };
      }

      const role = await this.roleRepo.findRoleByID(profile.role_id);

      if (!role) {
        return {
          message: "Role missing for profile",
          status: "error",
          user: null,
        };
      }

      return {
        message: "User found",
        status: "success",
        user: {
          ...user,
          profile,
          role,
        },
      };
    } catch (err) {
      console.error("findUser error:", err);
      return {
        message: "Internal Server Error",
        status: "error",
        user: null,
      };
    }
  }
}
