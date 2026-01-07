import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export type Locale = "az" | "en";

interface SearchProps {
    onSearch: (value: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
    const locale: Locale = useSelector((state: RootState) => state.locale.value);
    const [searchValue, setSearchValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    return (
        <div>
            <div className='bg-[#fff] px-[10px] py-[10px] rounded-[20px] flex justify-start items-center'>
                <SearchIcon className='text-gray-400 mr-[10px]' />
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleChange}
                    placeholder={locale === "az" ? "Axtarış edin..." : "Search..."}
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                />
            </div>
        </div>
    );
}
