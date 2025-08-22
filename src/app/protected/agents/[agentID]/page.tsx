import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

// import { useState, useEffect } from "react";
import { fetchAgent } from "@/utils/db";
import AgentAvatarPlaceholder from "@/assets/avatar/agent-avatar-placeholder.jpg";
import { CameraIcon } from "./_components/icons";
import CoverPhoto01 from "@/assets/images/cover/cover-01.png";
import CoverPhoto02 from "@/assets/images/cover/cover-02.jpg";
import CoverPhoto03 from "@/assets/images/cover/cover-03.jpg";
import CoverPhoto04 from "@/assets/images/cover/cover-04.jpg";
import CoverPhoto05 from "@/assets/images/cover/cover-05.jpg";

interface PageProps {
  params: {
    agentID: string;
  };
}

export default async function AgentProfilePage({ params }: PageProps) {
  const { agentID } = params;
  const num: number = Math.floor(Math.random() * 5) + 1;
  let coverPhoto;
  if (num == 1) {
    coverPhoto = CoverPhoto01;
  } else if (num == 2) {
    coverPhoto = CoverPhoto02;
  } else if (num == 3) {
    coverPhoto = CoverPhoto03;
  } else if (num == 4) {
    coverPhoto = CoverPhoto04;
  } else {
    coverPhoto = CoverPhoto05;
  }
  const agentIDNumber = Number(agentID);
  const agent = await fetchAgent(agentIDNumber);
  return (
    <>
      {agent ? (
        <div className="mx-auto w-full max-w-[970px]">
          <Breadcrumb pageName="Profile" />

          <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="relative z-20 h-35 md:h-65">
              <Image
                src={coverPhoto}
                alt="profile cover"
                className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
                // width={970}
                // height={260}
                fill
                // style={{
                //   width: "auto",
                //   height: "auto",
                // }}
              />
              <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                <label
                  htmlFor="cover"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
                >
                  <input
                    type="file"
                    name="coverPhoto"
                    id="coverPhoto"
                    className="sr-only"
                    // onChange={() => {}}
                    accept="image/png, image/jpg, image/jpeg"
                  />

                  <CameraIcon />

                  <span>Edit</span>
                </label>
              </div>
            </div>
            <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
                <div className="relative drop-shadow-2">
                  {AgentAvatarPlaceholder && (
                    <>
                      <Image
                        src={AgentAvatarPlaceholder}
                        width={160}
                        height={160}
                        className="overflow-hidden rounded-full"
                        alt="profile"
                      />

                      <label
                        htmlFor="profilePhoto"
                        className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                      >
                        <CameraIcon />

                        <input
                          type="file"
                          name="profilePhoto"
                          id="profilePhoto"
                          className="sr-only"
                          // onChange={() => {}}
                          accept="image/png, image/jpg, image/jpeg"
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                  {agent?.name}
                </h3>
                <p className="font-medium">Agent</p>
                <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                    <span className="font-medium text-dark dark:text-white">
                      0
                    </span>
                    <span className="text-body-sm">Contracts</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                    <span className="font-medium text-dark dark:text-white">
                      0
                    </span>
                    <span className="text-body-sm">Players</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                    <span className="font-medium text-dark dark:text-white">
                      0
                    </span>
                    <span className="text-body-sm-sm">Win</span>
                  </div>
                </div>

                <div className="mx-auto max-w-[720px]">
                  <h4 className="font-medium text-dark dark:text-white">
                    About This Agent
                  </h4>
                  <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque posuere fermentum urna, eu condimentum mauris
                    tempus ut. Donec fermentum blandit aliquet. Etiam dictum
                    dapibus ultricies. Sed vel aliquet libero. Nunc a augue
                    fermentum, pharetra ligula sed, aliquam lacus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
