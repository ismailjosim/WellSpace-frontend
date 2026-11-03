"use client";

import type { UserInfo } from "@/types/user.interface";
import { updateMyProfile } from "@/services/auth/authService";
import {
  isUploadFileTooLarge,
  MAX_UPLOAD_FILE_SIZE_LABEL,
} from "@/lib/formDataHelper";
import MfaSettingsCard from "@/components/modules/Auth/MfaSettingsCard";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ProfileAvatarCard from "./ProfileAvatarCard";
import ProfileInformationFields from "./ProfileInformationFields";

interface MyProfileProps {
  userInfo: UserInfo;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const profileData =
    userInfo.role === "ADMIN" || userInfo.role === "SUPER_ADMIN"
      ? userInfo.admin
      : userInfo.role === "DOCTOR"
        ? userInfo.doctor
        : userInfo.role === "PATIENT"
          ? userInfo.patient
          : undefined;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (isUploadFileTooLarge(file || null)) {
      event.currentTarget.value = "";
      setPreviewImage(null);
      setError(
        `Profile photo must be ${MAX_UPLOAD_FILE_SIZE_LABEL} or smaller.`,
      );
      return;
    }

    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await updateMyProfile(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);
      setPreviewImage(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your personal information
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <ProfileAvatarCard
            userInfo={userInfo}
            profilePhoto={profileData?.profilePhoto}
            previewImage={previewImage}
            isPending={isPending}
            onImageChange={handleImageChange}
          />
          <ProfileInformationFields
            userInfo={userInfo}
            profileData={profileData}
            isPending={isPending}
            error={error}
            success={success}
          />
        </div>
      </form>

      <div className="mx-auto mt-6 max-w-6xl">
        <MfaSettingsCard isMfaInitiallyEnabled={!!userInfo.isMfaEnabled} />
      </div>
    </div>
  );
};

export default MyProfile;
