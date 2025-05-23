import { useTonClient } from "@/hooks/useTonClient";
import { Address, OpenedContract, Sender, toNano } from "@ton/core";
import { encodeOffChainContent } from "@/utils/toncrypt.utils";
import { useEffect, useState } from "react";
import { ProfileFactory } from "@/wrappers/profileFactory";
import { Profile } from "@/wrappers/profile";
import { getProfileAddress } from "../lib/ton.lib";

export function useProfileContract() {
    const { client } = useTonClient();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (client) {
            setReady(true);
        }
    }, [client]);

    const enrollToProfileContract = async (
        sender: Sender,
        profileUrl: string
    ) => {
        const PROFILE_CONTENT = encodeOffChainContent(`ipfs://${profileUrl}`);
        const profileFactory = client?.open(
            ProfileFactory.fromAddress(
                Address.parse(
                    "EQCriJIjnxh2NedMZUiEhV4DT4RIO6_FjQvP5kc3LsqvE7cx"
                )
            )
        );

        if (!profileFactory) {
            console.error("Profile Factory contract not found");
            return null;
        }
        await profileFactory.send(
            sender,
            {
                value: toNano("0.1"),
            },
            {
                $$type: "ProfileCreate",
                profile_content: PROFILE_CONTENT,
            }
        );
    };

    const updateProfileContract = async (
        sender: Sender,
        profileUrl: string
    ) => {
        const PROFILE_CONTENT = encodeOffChainContent(`ipfs://${profileUrl}`);
        const profileFactory = client?.open(
            ProfileFactory.fromAddress(
                Address.parse(
                    "EQCriJIjnxh2NedMZUiEhV4DT4RIO6_FjQvP5kc3LsqvE7cx"
                )
            )
        );
        const profileAddr = await getProfileAddress(sender.address!.toString());

        const profile = client?.open(
            Profile.fromAddress(Address.parse(profileAddr!))
        ) as OpenedContract<Profile>;

        if (!profileFactory || !profile) {
            console.error("Profile Factory or Profile contract not found");
            return null;
        }
        await profile.send(
            sender,
            {
                value: toNano("0.03"),
            },
            {
                $$type: "Transfer",
                query_id: 0n,
                new_owner: null,
                response_destination: null,
                custom_payload: PROFILE_CONTENT,
                forward_amount: null,
                forward_payload: null,
            }
        );
    };

    return {
        enrollToProfileContract,
        updateProfileContract,
        ready,
    };
}
