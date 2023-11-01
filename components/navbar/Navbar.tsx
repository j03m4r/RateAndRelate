"use client";

import { useRouter } from "next/navigation";
import Container from "../general/Container";
import UserMenu from "./UserMenu";
import { Notification } from "@/types";

interface NavbarProps {
    notifications: Notification[];
};

const Navbar: React.FC<NavbarProps> = ({
    notifications
}) => {
    const router = useRouter();
    return (
        <div className="fixed w-full z-10 py-5">
            <Container>
                <div
                        className="
                            flex
                            flex-row
                            items-center
                            justify-between
                        ">
                            <div className="select-none text-4xl text-orange hover:cursor-pointer w-fit"
                            onClick={() => router.push("/home")}>Rate & Relate</div>
                            <UserMenu notifications={notifications} />
                    </div>
            </Container>
        </div>
    );
}

export default Navbar;