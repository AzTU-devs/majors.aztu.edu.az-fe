import LocaleSync from "@/components/localeSync/LocaleSync";

// Wraps every /[lang]/* route and keeps the Redux locale aligned with the URL.
export default function LangLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <LocaleSync />
            {children}
        </>
    );
}
