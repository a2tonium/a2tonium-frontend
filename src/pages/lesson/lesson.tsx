import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LessonSidebar } from "@/components/lessonSidebar/lessonSidebar";
import { LessonVideo } from "@/components/lessonVideo/lessonVideo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ModuleInterfaceNew, LessonInterface } from "@/types/course.types";
import { LessonSkeleton } from "@/components/lesson/lessonSkeleton";
import { ErrorPage } from "@/pages/error/error";
import { useCourseDataIfEnrolled } from "@/hooks/useCourseDataIfEnrolled";
import { useTranslation } from "react-i18next";

export function Lesson() {
    const { t } = useTranslation();
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const { courseAddress } = useParams();

    const {
        data: course,
        error,
        isLoading,
    } = useCourseDataIfEnrolled(courseAddress);

    if (error) {
        if (error.message === "Access denied") {
            return (
                <ErrorPage
                    first={t("lesson.accessDenied.title")}
                    second={t("lesson.accessDenied.message")}
                    third={t("lesson.accessDenied.retry")}
                />
            );
        } else {
            return (
                <ErrorPage
                    first={t("lesson.error.title")}
                    second={t("lesson.error.message")}
                    third={t("lesson.error.retry")}
                />
            );
        }
    }

    if (isLoading || !course) {
        return <LessonSkeleton />;
    }

    const allModules = course.data!.modules;
    const currentModule: ModuleInterfaceNew | undefined = allModules.find((m) =>
        m.lessons.some((l) => l.id === lessonId)
    );

    if (!currentModule) {
        return (
            <ErrorPage
                first={t("lesson.moduleNotFound.title")}
                second={t("lesson.moduleNotFound.message")}
                third={t("lesson.moduleNotFound.retry")}
            />
        );
    }

    const lessons = currentModule.lessons;
    const currentLessonIndex = lessons.findIndex((l) => l.id === lessonId);
    const currentLesson: LessonInterface = lessons[currentLessonIndex];

    const isFirstLesson = currentLessonIndex === 0;
    const isLastLesson = currentLessonIndex === lessons.length - 1;

    const goToLesson = (index: number) =>
        navigate(`../lesson/${lessons[index].id}`);

    const handlePrevLesson = () =>
        !isFirstLesson && goToLesson(currentLessonIndex - 1);

    const handleNextLesson = () =>
        !isLastLesson && goToLesson(currentLessonIndex + 1);

    return (
        <SidebarProvider>
            <div className="flex w-full mx-auto bg-white rounded-[2vw] xl:border-[6px] border-gray-200">
                <div className="">
                    <LessonSidebar
                        data={{
                            course: {
                                courseId: "1",
                                courseTitle: course.data!.name,
                            },
                            modules: allModules.map((m) => ({
                                moduleTitle: m.title,
                                lessons: m.lessons,
                            })),
                        }}
                        activeLessonId={lessonId!}
                    />
                </div>

                <div className="hidden md:block w-[0.1px] bg-gray-200" />

                <div className="py-6 flex-grow">
                    <div className="flex">
                        <SidebarTrigger className="block min-[1000px]:hidden px-3" />
                        <p className="pl-3 text-lg sm:text-2xl font-semibold text-gray-800">
                            {currentLessonIndex + 1}. {currentLesson.title}
                        </p>
                    </div>
                    <Separator className="mb-2" />

                    <div className="w-full p-2">
                        <LessonVideo
                            video_id={currentLesson.videoId}
                            opts={{
                                width: "100%",
                                height: "100%",
                                playerVars: {
                                    modestbranding: 1,
                                    rel: 0,
                                    showinfo: 0,
                                    controls: 1,
                                    autoplay: 1,
                                },
                            }}
                        />
                    </div>
                    <Separator className="mt-2" />

                    <div className="flex justify-between mt-6 mx-6">
                        <Button
                            onClick={handlePrevLesson}
                            disabled={isFirstLesson}
                            className={`rounded-2xl bg-blue-500 p-2.5 flex items-center gap-2 ${
                                isFirstLesson
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "hover:bg-blue-700"
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>{t("lesson.back")}</span>
                        </Button>

                        <Button
                            onClick={handleNextLesson}
                            disabled={isLastLesson}
                            className={`rounded-2xl bg-blue-500 p-2.5 flex items-center gap-2 ${
                                isLastLesson
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "hover:bg-blue-700"
                            }`}
                        >
                            <span>{t("lesson.next")}</span>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
