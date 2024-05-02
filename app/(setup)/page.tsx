import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";
import { importData } from "@/lib/db-migrate";

const SetupPage = async () => {
    const profile = await initialProfile();

    var server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }   


    server = await db.server.findFirst()

    if (!server) {
        await importData();
    }
    
    return (<InitialModal/>);
    
}
 

export default SetupPage;