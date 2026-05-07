"use content";

import { Locale } from "../gco/Gco";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DoneIcon from '@mui/icons-material/Done';
import { PloInterface } from "@/services/plo/ploService";
import { getPloBySpecialty } from "@/services/plo/ploService";
import { getSpecialtyDetails } from "@/services/specialty/specialtyService";

export default function SubjectMatchTable() {
    const params = useParams();
    const specialtyCodeParam = params.specialtyCode;
    const specialtyCode: string = Array.isArray(specialtyCodeParam)
        ? specialtyCodeParam[0]
        : specialtyCodeParam || "";
    const [loading, setLoading] = useState(false);
    const [plos, setPlos] = useState<PloInterface[]>([]);
    const [specialtyName, setSpecialtyName] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);

    useEffect(() => {
        setLoading(true);
        getSpecialtyDetails(specialtyCode, locale)
            .then(setSpecialtyName)
            .finally(() => {
                setLoading(false)
            });
        getPloBySpecialty(specialtyCode ? specialtyCode : "", locale)
            .then(setPlos)
            .finally(() => {
                setLoading(false);
            });
    }, [locale]);

    return (
        <div>
            <table className="w-full border border-solid border-black rounded-xl border-collapse overflow-hidden">
                <thead>
                    <tr>
                        <th></th>
                        {plos.map((plo, index) => (
                            <th
                                key={plo.id ?? index}
                                className="border px-4 py-3 text-center"
                                style={{ backgroundColor: '#182f79', color: '#fff' }}
                            >
                                {plo.plo_content}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-100 transition-colors">
                        <td className="border px-4 py-3 text-center">Proqramlaşdırmanın əsasları</td>
                        <td className="border px-4 py-3 text-center"></td>

                        <td className="border px-4 py-3 text-center"></td>
                        <td className="border px-4 py-3 text-center">
                            <DoneIcon className="text-green-500 mx-auto" />
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors">
                        <td className="border px-4 py-3 text-center">İnformasiya Texnalogiyaları</td>
                        <td className="border px-4 py-3 text-center"></td>
                        <td className="border px-4 py-3 text-center">
                            <DoneIcon className="text-green-500 mx-auto" />
                        </td>
                        <td className="border px-4 py-3 text-center">
                            <DoneIcon className="text-green-500 mx-auto" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
