import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DoctorQualificationSelect from "@/components/shared/DoctorQualificationSelect";
import type { IDoctor } from "@/types/doctor.interface";
import type { IPatient } from "@/types/patient.interface";
import type { UserInfo } from "@/types/user.interface";
import { Loader2, Save } from "lucide-react";

type ProfileRecord = {
  name?: string | null;
  contactNumber?: string | null;
};

type ProfileInformationFieldsProps = {
  userInfo: UserInfo;
  profileData?: ProfileRecord | null;
  isPending: boolean;
  error: string | null;
  success: string | null;
};

export default function ProfileInformationFields({
  userInfo,
  profileData,
  isPending,
  error,
  success,
}: ProfileInformationFieldsProps) {
  const doctor: IDoctor | undefined =
    userInfo.role === "DOCTOR" ? userInfo.doctor : undefined;
  const patient: IPatient | undefined =
    userInfo.role === "PATIENT" ? userInfo.patient : undefined;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div
            className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-600"
            role="status"
          >
            {success}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={profileData?.name || userInfo.name}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber" required>
              Contact Number
            </Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              defaultValue={profileData?.contactNumber || ""}
              required
              disabled={isPending}
            />
          </div>

          {doctor && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={doctor.address || ""}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber" required>
                  Registration Number
                </Label>
                <Input
                  id="registrationNumber"
                  name="registrationNumber"
                  defaultValue={doctor.registrationNumber || ""}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  defaultValue={doctor.experience || ""}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentFee" required>
                  Appointment Fee
                </Label>
                <Input
                  id="appointmentFee"
                  name="appointmentFee"
                  type="number"
                  defaultValue={doctor.appointmentFee || ""}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification" required>
                  Qualification
                </Label>
                <DoctorQualificationSelect
                  id="qualification"
                  name="qualification"
                  defaultValue={doctor.qualification || ""}
                  disabled={isPending}
                  placeholder="Select or type qualifications (e.g. MBBS, MD)..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWorkingPlace" required>
                  Current Working Place
                </Label>
                <Input
                  id="currentWorkingPlace"
                  name="currentWorkingPlace"
                  defaultValue={doctor.currentWorkingPlace || ""}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation" required>
                  Designation
                </Label>
                <Input
                  id="designation"
                  name="designation"
                  defaultValue={doctor.designation || ""}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" required>
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={doctor.gender || "MALE"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </>
          )}

          {patient && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={patient.address || ""}
                disabled={isPending}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
