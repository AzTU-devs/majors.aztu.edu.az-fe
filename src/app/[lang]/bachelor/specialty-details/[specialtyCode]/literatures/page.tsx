"use client";

import { Locale } from '../page';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Literatures from '@/components/Literatures/Literatures';
import { getSpecialtyDetails } from '@/services/specialty/specialtyService';

export default function page() {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const subjectCodeParam = params.specialtyCode;
    const [specialtyName, setSpecialtyName] = useState("");
    const subjectCode: string = Array.isArray(subjectCodeParam)
        ? subjectCodeParam[0]
        : subjectCodeParam || "";
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    useEffect(() => {
        setLoading(true);
        getSpecialtyDetails(subjectCode, locale)
            .then(setSpecialtyName)
            .finally(() => {
                setLoading(false)
            });
    }, [locale]);
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-8">
                <Literatures subjectCode={subjectCode} />
            </main>
            <Footer />
        </div>
    )
}