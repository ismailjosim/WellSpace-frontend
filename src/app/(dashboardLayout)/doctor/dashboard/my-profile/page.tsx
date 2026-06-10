import MyProfile from "@/components/modules/MyProfile/MyProfile";
import { getUserInfo } from "@/services/auth/getUserInfo";

const DoctorMyProfilePage = async () => {
  const userInfo = await getUserInfo();

  return <MyProfile userInfo={userInfo} />;
};

export default DoctorMyProfilePage;
