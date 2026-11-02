"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/services/auth/logoutUser";
import { UserInfo } from "@/types/user.interface";
import { KeyRound, User } from "lucide-react";
import Link from "next/link";
import UserLogout from "../../shared/UserLogout";
import ChangePasswordDialog from "../Auth/ChangePasswordDialog";

interface UserDropdownProps {
  userInfo: UserInfo | null;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-9 w-9 bg-accent/40 border-border/60 hover:bg-accent hover:border-primary/50 transition-all"
          >
            <span className="text-sm font-bold text-foreground">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 p-1.5 shadow-lg">
          <DropdownMenuLabel className="p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {userInfo?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userInfo?.email}
              </p>
              <div className="pt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                  {userInfo?.role.toLowerCase()}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={"/my-profile"}
              className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-lg text-xs font-medium hover:bg-accent"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsChangePasswordOpen(true)}
            className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-lg text-xs font-medium hover:bg-accent"
          >
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <span>Change Password</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
          >
            <UserLogout />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordDialog
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
        />
      )}
    </>
  );
};

export default UserDropdown;
