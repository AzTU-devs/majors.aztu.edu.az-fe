"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clo, getCloBySubjectCode } from "@/services/clo/clo";
import { getSubjectDetails, SubjectDetails } from "@/services/curricula/curricula";
import { getLiteratures, Literature } from "@/services/literature/literatureService";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function SubjectsSillabus() {
    const searchParams = useSearchParams();
    const subjectCode = searchParams.get("subjectCode") || "";
    const [clos, setClos] = useState<Clo[]>([]);
    const [literatures, setLiteratures] = useState<Literature[]>([]);
    const locale = useSelector((state: RootState) => state.locale.value);
    const [subjectDetails, setSubjectDetails] = useState<SubjectDetails>();

    useEffect(() => {
        getCloBySubjectCode(subjectCode || "")
            .then(setClos);
        getSubjectDetails(subjectCode, locale)
            .then(setSubjectDetails)
        getLiteratures(subjectCode || "")
            .then((res) => {
                if (res === "NO CONTENT" || res === "ERROR") {
                    setLiteratures([]);
                } else if (typeof res === "object" && Array.isArray(res.literatures)) {
                    setLiteratures(res.literatures);
                } else {
                    setLiteratures([]);
                }
            });
    }, [subjectCode]);

    console.log(literatures);

    return (
        <>
            <Header />
            <main className="flex flex-col justify-center items-center p-10">
                <h1 className="mb-[10px] font-bold text-[30px]">Sillabus</h1>
                <div className="border border-gray-300 rounded-lg overflow-hidden mt-4 w-[95%]">
                <table className="w-full border-collapse border border-gray-300 text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th colSpan={5} className="border border-gray-300 p-3 text-lg font-semibold">
                                Fənn başlığı: {subjectDetails?.subject_name}
                            </th>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-3">Fənn kodu: {subjectCode}</th>
                            <th className="border border-gray-300 p-3">Tələbə işi - Yük (cəmi): 240 saat</th>
                            <th className="border border-gray-300 p-3">Kredit: {subjectDetails?.credit}</th>
                            <th className="border border-gray-300 p-3">Semestr: {subjectDetails?.semester === 1 ? "Yaz semesteri" : "Payız semesteri"}</th>
                            <th className="border border-gray-300 p-3">Müddət: 1 il</th>
                        </tr>
                    </thead>
                    <tbody className="even:bg-gray-50">
                        <tr className="border border-gray-300">
                            <td className="border border-gray-300 p-3 text-center font-medium">1</td>
                            <td className="border border-gray-300 p-3">
                                Təlimat növü(ləri):
                                <ol type="a" className="list-[lower-alpha] pl-5">
                                    <li>Mühazirə</li>
                                    <li>Məşğələ</li>
                                    <li>Laboratoriya</li>
                                    <li>Digər</li>
                                </ol>
                            </td>
                            <td className="border border-gray-300 p-3">
                                Əlaqə saatları:
                                <ol type="a" className="list-[lower-alpha] pl-5">
                                    <li>30 saat</li>
                                    <li>30 saat</li>
                                    <li>15 saat</li>
                                </ol>
                            </td>
                            <td className="border border-gray-300 p-3">
                                Müstəqil təhsil: 165 saat
                            </td>
                            <td className="border border-gray-300 p-3">
                                Maksimum qrup ölçüsü: 20 tələbə
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                2
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                Modul/kursun növü: {subjectDetails?.status === 1 ? "Seçmə" : "Məcburi"}
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                3
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                İştirak üçün ilkin şərtlər (əgər varsa) tələbələr modulu uğurla başa vurmalıdırlar: <span className="font-bold">Fundamentals of computer engineering</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                4
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                Təlim nəticələri
                                <ul className="list-none pl-0">
                                    {clos && clos.map((clo, index) => (
                                        <li key={index} className="flex items-start mb-2">
                                            <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                            <span>{clo.clo_content}</span>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                5
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                Tədris metodları
                                <ul className="list-none pl-0">
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>layihə işi</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>keys araşdırmaları</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>qrup işi</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>mühazirələr</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>müzakirələr</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>seminarlar</span>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                6
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                Qiymətləndirmə üsulları
                                <ul className="list-none pl-0">
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>aralıq imtahan (fərdi, 30 dəqiqə)</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>dörd tələbənin bir mövzu üzrə qrup təqdimatı (maksimum 40 dəqiqə)</span>
                                    </li>
                                    <li className="flex items-start mb-2">
                                        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                        <span>fərdi yekun şifahi imtahan (10 dəqiqə)</span>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                7
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                Modul/kurs üçün məsuliyyət: <span>Zəfər Cəfərov</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-center font-medium">
                                8
                            </td>
                            <td colSpan={5} className="border border-gray-300 p-3 font-medium bg-gray-50">
                                <ul className="list-none pl-0">
                                    {literatures && literatures.map((literature, index) => (
                                        <li key={index} className="flex items-start mb-2">
                                            <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3"></span>
                                            <span>{literature.literature_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </main>
            <Footer />
        </>
    );
}