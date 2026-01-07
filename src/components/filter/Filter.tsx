"use client";

import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { Faculty, getFaculties } from '@/services/faculty/facultyService';
import { Cafedra, getCafedrasByFaculty } from '@/services/cafedra/cafedraService';

type FilterProps = {
    onFilterChange: (filters: { faculty_code?: string; cafedra_code?: string; specialty_name?: string; specialty_code?: string }) => void;
};

export type Locale = "az" | "en";

export default function Filter() {
    const [loading, setLoading] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [selecteCafedra, setSelectedCafedra] = useState("");
    const [specialtyName, setSpecialtyName] = useState("");
    const [specialtyCode, setSpecialtyCode] = useState("");
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [cafedras, setCafedras] = useState<Cafedra[]>([]);

    useEffect(() => {
        setLoading(true);
        getFaculties(locale)
            .then(setFaculties)
            .finally(
                () => {
                    setLoading(false);
                }
            );
        getCafedrasByFaculty(selectedFaculty)
            .then((res) => setCafedras(Array.isArray(res) ? res : []))
    }, []);

    console.log(selectedFaculty);
    console.log(cafedras);

    // const handleFacultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = event.target.value;
    //     setSelectedFaculty(value);
    //     onFilterChange({
    //         faculty_code: value || undefined,
    //         cafedra_code: selecteCafedra || undefined,
    //         specialty_name: specialtyName || undefined,
    //         specialty_code: specialtyCode || undefined,
    //     });
    // };

    // const handleCafedraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = event.target.value;
    //     setSelectedCafedra(value);
    //     onFilterChange({
    //         faculty_code: selectedFaculty || undefined,
    //         cafedra_code: value || undefined,
    //         specialty_name: specialtyName || undefined,
    //         specialty_code: specialtyCode || undefined,
    //     });
    // };

    // const handleSpecialtyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = event.target.value;
    //     setSpecialtyName(value);
    //     onFilterChange({
    //         faculty_code: selectedFaculty || undefined,
    //         cafedra_code: selecteCafedra || undefined,
    //         specialty_name: value || undefined,
    //         specialty_code: specialtyCode || undefined,
    //     });
    // };

    // const handleSpecialtyCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = event.target.value;
    //     setSpecialtyCode(value);
    //     onFilterChange({
    //         faculty_code: selectedFaculty || undefined,
    //         cafedra_code: selecteCafedra || undefined,
    //         specialty_name: specialtyName || undefined,
    //         specialty_code: value || undefined,
    //     });
    // };

    // const handleFilterClick = () => {
    //     onFilterChange({
    //         faculty_code: selectedFaculty || undefined,
    //         cafedra_code: selecteCafedra || undefined,
    //         specialty_name: specialtyName || undefined,
    //         specialty_code: specialtyCode || undefined,
    //     });
    // };

    return (
        <aside className="w-full md:w-[100%] p-4 bg-gray-200 rounded-[5px]">
            <div className="flex flex-row gap-4 w-full">
                <TextField
                    select
                    label="Fakültə"
                    variant="standard"
                    value={selectedFaculty}
                    // onChange={handleFacultyChange}
                    InputLabelProps={{ style: { color: '182f79' } }}
                    InputProps={{ style: { color: '182f79', backgroundColor: 'transparent', borderRadius: 4, padding: '10px 12px' } }}
                    sx={{
                        minWidth: 180,
                        flexGrow: 1,
                        '& .MuiSvgIcon-root': { color: '182f79' },
                        '& .MuiSelect-icon': { color: '182f79' },
                        '&:hover .MuiInputBase-root': {
                            borderColor: '182f79',
                        },
                        '& .Mui-focused': {
                            borderColor: '182f79',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '182f79',
                            opacity: 1,
                        },
                    }}
                >
                    {faculties.map((faculty, index) => {
                        return (
                            <MenuItem key={index} value={`${faculty.faculty_code}`}>{faculty.faculty_name}</MenuItem>
                        )
                    })}
                </TextField>
                <TextField
                    select
                    label="Kafedra"
                    variant="standard"
                    value={selecteCafedra}
                    // onChange={handleCafedraChange}
                    InputLabelProps={{ style: { color: '182f79' } }}
                    InputProps={{ style: { color: '182f79', backgroundColor: 'transparent', borderRadius: 4, padding: '10px 12px' } }}
                    sx={{
                        minWidth: 180,
                        flexGrow: 1,
                        '& .MuiSvgIcon-root': { color: '182f79' },
                        '& .MuiSelect-icon': { color: '182f79' },
                        '&:hover .MuiInputBase-root': {
                            borderColor: '182f79',
                        },
                        '& .Mui-focused': {
                            borderColor: '182f79',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '182f79',
                            opacity: 1,
                        },
                    }}
                >
                    {cafedras.map((cafedras, index) => {
                        return (
                            <MenuItem key={index} value={`${cafedras.cafedra_code}`}>{cafedras.cafedra_name}</MenuItem>
                        )
                    })}
                </TextField>
                <TextField
                    label="İxtisas adı"
                    variant="standard"
                    type="text"
                    value={specialtyName}
                    // onChange={handleSpecialtyNameChange}
                    InputLabelProps={{ style: { color: '182f79' } }}
                    InputProps={{ style: { color: '182f79', backgroundColor: 'transparent', borderRadius: 4, padding: '10px 12px' } }}
                    sx={{
                        minWidth: 180,
                        flexGrow: 1,
                        '&:hover .MuiInputBase-root': {
                            borderColor: '182f79',
                        },
                        '& .Mui-focused': {
                            borderColor: '182f79',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '182f79',
                            opacity: 1,
                        },
                    }}
                />
                <TextField
                    label="İxtisas kodu"
                    variant="standard"
                    type="text"
                    value={specialtyCode}
                    // onChange={handleSpecialtyCodeChange}
                    InputLabelProps={{ style: { color: '182f79' } }}
                    InputProps={{ style: { color: '182f79', backgroundColor: 'transparent', borderRadius: 4, padding: '10px 12px' } }}
                    sx={{
                        minWidth: 180,
                        flexGrow: 1,
                        '&:hover .MuiInputBase-root': {
                            borderColor: '182f79',
                        },
                        '& .Mui-focused': {
                            borderColor: '182f79',
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '182f79',
                            opacity: 1,
                        },
                    }}
                />
            </div>
        </aside>
    )
}
