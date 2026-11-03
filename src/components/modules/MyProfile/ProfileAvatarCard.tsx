import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UserInfo } from "@/types/user.interface";
import { Camera } from "lucide-react";
import { getInitials } from "../../../lib/formatters.ts";

type ProfileAvatarCardProps = {
  userInfo: UserInfo;
  profilePhoto?: string | null;
  previewImage: string | null;
  isPending: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileAvatarCard({
  userInfo,
  profilePhoto,
  previewImage,
  isPending,
  onImageChange,
}: ProfileAvatarCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-32 w-32">
            {previewImage || profilePhoto ? (
              <AvatarImage
                src={previewImage || profilePhoto || undefined}
                alt={userInfo.name || "User"}
              />
            ) : (
              <AvatarFallback className="text-3xl">
                {getInitials(userInfo.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <label
            htmlFor="file"
            aria-label="Upload profile photo"
            className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            <Input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
              disabled={isPending}
            />
          </label>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold">{userInfo.name || "User"}</p>
          <p className="text-sm text-muted-foreground">{userInfo.email}</p>
          <p className="mt-1 text-xs capitalize text-muted-foreground">
            {(userInfo.role || "PATIENT").replace("_", " ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
