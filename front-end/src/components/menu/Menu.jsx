import { MdOutlineDashboard } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { PiUploadSimpleBold } from "react-icons/pi";
import { PiExam } from "react-icons/pi";

export const adminMenuData = [
  { label: "Dashboard", url: "/dashboard", icon: MdOutlineDashboard },
  { label: "Manage Employee", url: "/manageEmployee", icon: IoPersonOutline },
  { label: "Manage Student", url: "/manageStudent", icon: PiStudentBold },
  { label: "Manage Course", url: "/manageCourse", icon: FaBook },
];

export const instructorMenuData = [
  { label: "Dashboard", url: "/", icon: MdOutlineDashboard },
  { label: "Manage Exam", url: "/manageExam", icon: PiExam },
  { label: "Manage Uploads", url: "/manageUploads", icon: PiUploadSimpleBold },
];
