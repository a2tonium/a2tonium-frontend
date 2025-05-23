import { TeachCard } from "@/components/teachCard/teachCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TeachCardSkeleton } from "@/components/teachCard/teachCardSkeleton";
import { ErrorPage } from "@/pages/error/error";
import { useClientOwnedCoursesList } from "@/hooks/useClientOwnerCoursesList";
import { useTranslation } from "react-i18next";

export const Teach = () => {
    const { t } = useTranslation();
    const { data: courses, error, isLoading } = useClientOwnedCoursesList();
    const navigate = useNavigate();

    const handleAddCourse = () => {
        navigate(`create`);
    };

    if (error) {
        return (
            <ErrorPage
                first={t("teach.error.title")}
                second={t("teach.error.second")}
                third={t("teach.error.third")}
            />
        );
    }

    return (
        <main className="p-4 max-w-4xl bg-white p-4 flex flex-col items-center mx-auto pb-10 rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="w-full max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="md:text-2xl sm:text-xl font-bold">
                        {t("teach.heading")}
                    </h2>
                    <Button
                        onClick={handleAddCourse}
                        variant="outline"
                        className="flex items-center border-blue-500 text-blue-500 
                        hover:border-blue-700 hover:text-blue-700 transition-colors duration-200 rounded-2xl"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-semibold">{t("teach.new")}</span>
                    </Button>
                </div>
                <div className="space-y-4">
                    {isLoading && !courses && (
                        <>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TeachCardSkeleton key={index} />
                            ))}
                        </>
                    )}

                    {courses && courses.length === 0 && (
                        <div className="flex flex-col items-center space-y-4 mt-8">
                            <img
                                src="/images/coding.svg"
                                alt="No courses"
                                className="w-[180px] h-auto"
                            />
                            <p className="text-gray-700 text-center text-sm md:text-lg">
                                {t("teach.empty") + " "}
                                <Link
                                    to="/catalog"
                                    className="text-goluboy hover:text-blue-600 underline"
                                >
                                    {t("teach.catalog")}
                                </Link>
                                .
                            </p>
                        </div>
                    )}

                    {courses &&
                        courses.length > 0 &&
                        courses.map((course) => (
                            <TeachCard key={course.courseAddress} {...course} />
                        ))}
                </div>
            </div>
        </main>
    );
};
