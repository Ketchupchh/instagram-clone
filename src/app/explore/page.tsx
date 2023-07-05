'use client'

import { ChangeEvent, useEffect, useState } from "react";
import type { User } from "@/lib/types/user";
import { fetchUsers } from "@/lib/firebase/utils";
import { UserCard } from "@/components/user/user-card";


export default function Explore() {

    const [inputValue, setInputValue] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

        let timer: NodeJS.Timeout;
    
        if(searchLoading)
        {
            timer = setTimeout(() => {
                setSearchLoading(false);
            }, 1000);
        }
    
        return () => {
          clearTimeout(timer);
        };

    }, [searchLoading]);

    const handleChange = async ({
      target: { value }
    }: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setInputValue(value);

        if(!searchLoading)
        {
          setUsers([]);
          setUsers(await fetchUsers(inputValue));
          setSearchLoading(true);
        }
    }

    return (
        <div className="xs:hidden block w-screen min-h-screen">
            <div className="flex flex-col w-full h-full px-5">

                <input
                    className="outline-none dark:bg-neutral-800 bg-neutral-400 h-10 rounded-md px-3 mt-24"
                    placeholder="Search"
                    type="search"
                    value={inputValue}
                    onChange={handleChange}
                />

                {searchLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {users.map((user, index) => (
                            <UserCard key={index} {...user} avatarSize="w-12 h-12" includeName name={user.name}/>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}