import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const isCandidate = user?.userType === "candidate";

  return (
    <div className="md:w-[50%] w-full mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col  items-center  gap-6">
        <img
          src={user.profilePic || user.logoUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border shadow"
        />

        <div className="w-full">
          <div className="flex flex-col gap-4 text-gray-700">
            <div>
              <span className=" font-bold mb-2">
                {isCandidate ? `Name: ` : `Organization: `}
              </span>
              {isCandidate ? user.name : user.organizationName}
            </div>
            <div>
              <span className=" font-bold mb-2">{`Email: `} </span>
              {user.email}
            </div>
            <div>
              <span className=" font-bold mb-2">{`Phone: `} </span>
              {user.phone}
            </div>
            <div>
              <span className=" font-bold mb-2">{`Address: `} </span>
              {user.address}
            </div>
            {isCandidate ? (
              <div>
                <span className=" font-bold mb-2">{`Gender: `} </span>
                {user.gender}
              </div>
            ) : (
              <>
                <div>
                  <span className=" font-bold mb-2">{`Contact Person: `} </span>
                  {user.contactPerson}
                </div>
                <div>
                  <span className=" font-bold mb-2">{`Industry: `} </span>
                  {user.industry}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
