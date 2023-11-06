import { useEffect, useState } from "react";
import Input from "../inputs/Input";
import useDebounce from "@/hooks/useDebounce";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Profile } from "@/types";
import ProfileSearchItem from "./ProfileSearchItem";
import { twMerge } from "tailwind-merge";

const SearchUsers = () => {
    const [value, setValue] = useState<string>("");
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const debounecedValue = useDebounce<string>(value, 500);

    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        const fetchData = async () => {
            if (!debounecedValue) {
                return;
            }
        
            const { data, error } = await supabaseClient.from('profiles').select('*').ilike('username', `%${debounecedValue}%`)
            .order('username', { ascending: true });
        
            if (error) {
                console.log(error);
            }
            
            if (data) {
                setProfiles(data);
            }
        };

        fetchData();
    }, [debounecedValue,supabaseClient]);

    return (
        <div className="flex flex-col max-h-[30vh] lg:max-h-[20vh] p-2">
            <Input placeholder="Search users..." className="bg-cream placeholder:text-forestGreen text-forestGreen border-charcoal" 
            onChange={(e) => setValue(e.target.value)} />
            <div className="flex flex-col overflow-y-scroll">
                {profiles.map((profile) => (
                    <ProfileSearchItem key={profile.id} profile={profile} />
                ))}
            </div>
        </div>
    );
}

export default SearchUsers;