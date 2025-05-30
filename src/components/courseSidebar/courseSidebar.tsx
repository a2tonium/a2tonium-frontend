import { BookOpenText } from "lucide-react";
import { SidebarMain } from "@/components/courseSidebar/sidebarMain";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { CourseDeployedInterface, QuizAnswers } from "@/types/course.types";
import { useTranslation } from "react-i18next";
import { getLink } from "../../utils/ton.utils";

export function CourseSidebar({
    courseData,
    grades,
    ...props
}: {
    courseData: CourseDeployedInterface;
    grades: QuizAnswers[];
}) {
    const { isMobile } = useSidebar();
    const { t } = useTranslation();

    const data = [
        {
            title: t("courseSidebar.content"),
            url: "#",
            icon: BookOpenText,
            isActive: true,
            items: [
                {
                    title: t("courseSidebar.syllabus"),
                    url: "../syllabus",
                },
                {
                    title: t("courseSidebar.quizzes"),
                    url: "../quizzes",
                },
            ],
        },
    ];

    return (
        <div className="bg-white rounded-l-2xl m-0 sm:mt-5 sm:ml-5">
            <Sidebar
                collapsible={isMobile ? "icon" : "none"}
                {...props}
                className="bg-white rounded-l-2xl h-[calc(100vh-64px)] sticky top-[64px] left-0"
            >
                <SidebarHeader className="flex p-4">
                    <Avatar className="w-24 h-24 rounded-lg overflow-hidden">
                        <AvatarImage
                            className="w-full h-full object-cover"
                            src={getLink(courseData.image)}
                            alt={courseData.name}
                        />
                        <AvatarFallback>EC</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="line-clamp-5 text-md font-semibold break-words">
                            {courseData.name}
                        </p>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMain
                        items={data}
                        courseData={courseData}
                        grades={grades}
                    />
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
