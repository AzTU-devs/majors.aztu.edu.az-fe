"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import EmailIcon from '@mui/icons-material/Email';
import CopyrightIcon from '@mui/icons-material/Copyright';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AztuLogoLight from "@/../public/assets/aztu-logo-light.png";

export default function Footer() {
    const {lang} = useParams();
    return (
        <footer>
            <div className='bg-[#182f79] px-[50px] py-[40px]'>
                <div className='flex flex-col md:flex-row justify-between items-start w-full gap-6'>
                    <div className='w-full md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0'>
                        <Image src={AztuLogoLight} alt='Azərbaycan Texniki Universiteti' width={150} height={150} />
                    </div>
                    <div className='w-full md:w-1/3 flex justify-between items-start mb-6 md:mb-0'>
                        <div>
                            <h2 className='text-xl text-white mb-2 font-semibold'>Keçidlər</h2>
                            <ul className='flex flex-col gap-2'>
                                <li className='text-white'>
                                    <Link href={`/${lang}/bachelor`}>Bachelor</Link>
                                </li>
                                <li className='text-white'>
                                    <Link href={`/${lang}/master`}>Master</Link>
                                </li>
                                <li className='text-white'>
                                    <Link href={`/${lang}/faculties`}>Faculties</Link>
                                </li>
                                <li className='text-white'>
                                    <Link href={`/${lang}/specialties`}>Specialties</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className='text-xl text-white mb-2 font-semibold'>Dəstək</h2>
                            <ul className='flex flex-col gap-2'>
                                <li className='text-white'>
                                    <Link href={"/contact"}>Contact</Link>
                                </li>
                                <li className='text-white'>
                                    <Link href={"/location"}>Location</Link>
                                </li>
                                <li className='text-white'>
                                    <Link href={"/support"}>Support</Link>
                                </li>
                                <li className='text-white'>
                                    <Link href={"/about_us"}>About us</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='w-full md:w-1/3 flex justify-center md:justify-end items-start'>
                        <ul className='flex flex-col justify-start items-center md:items-start'>
                            <li className='flex justify-start items-center mb-2'>
                                <LocalPhoneIcon className='text-white mr-2' />
                                <Link href={"telto:+994 12 538-33-83"}>
                                    <p className='text-white'>Tel: (+994 12) 538-33-83</p>
                                </Link>
                            </li>
                            <li className='flex justify-start items-center mb-2'>
                                <LocalPhoneIcon className='text-white mr-2' />
                                <Link href={"telto:+994 12 539-13-05"}>
                                    <p className='text-white'>Qaynar xətt: (+994 12) 539-13-05</p>
                                </Link>
                            </li>
                            <li className='flex justify-start items-center mb-2'>
                                <EmailIcon className='text-white mr-2' />
                                <Link href={"mailto:aztu@aztu.edu.az"}>
                                    <p className='text-white'>E-poçt: aztu@aztu.edu.az</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                </div>
            </div>
            <div className='flex justify-center items-center w-full bg-[#0E205B] py-[12px]'>
                <CopyrightIcon className='text-white mr-[10px]' />
                <p className='text-white'>Azərbaycan Texniki Universiteti. Bütün hüquqlar qorunur.</p>
            </div>
        </footer>
    );
};
