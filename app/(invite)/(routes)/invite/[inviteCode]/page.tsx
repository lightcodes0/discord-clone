import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    // Find the server using inviteCode to get the server's id
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode
        }
    });

    if (existingServer) {
        // Update the server using the id
        const server = await db.server.update({
            where: {
                id: existingServer.id
            },
            data: {
                members: {
                    create: [
                        {
                            profileId: profile.id
                        }
                    ]
                }
            }
        });

        if (server) {
            return redirect(`/servers/${server.id}`);
        }
    }

    return (
        <div>
            Hello Invite
        </div>
    );
};

export default InviteCodePage;