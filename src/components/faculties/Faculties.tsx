import { t } from "@/lib/i18n";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export type Locale = "az" | "en";

export default function Faculties() {
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const faculties = [
        "nl",
        "enr",
        "mm",
        "itt",
        "xtt",
        "sim"
    ]
    return (
        <section className='px-[100px]'>
            {faculties.map((faculty, index) => {
                return (
                    <div
                        key={index}
                        className="my-[20px] border border-[rgba(0,0,0,0.2)] hover:bg-[#182f79] transition-colors duration-300 p-4 rounded cursor-pointer group"
                    >
                        <h2 aria-label={faculty} className="text-lg font-semibold group-hover:text-white text-[#182f79]">{t("faculty", `${faculty}`, locale)}</h2>
                    </div>
                )
            })}
        </section>
    )
}
