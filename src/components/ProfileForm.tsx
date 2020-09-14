import React, { useState } from "react";
import useProfile from "../hooks/useProfile";

const ProfileForm = () => {
  const { profile, changeProfile } = useProfile();
  const [stateProfile, setStateProfile] = useState(profile);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changeProfile({
      id: profile.id,
      email: stateProfile?.email,
      displayName: stateProfile?.display_name,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="text"
          value={stateProfile?.email}
          onChange={(e) =>
            setStateProfile({ ...profile, email: e.target.value })
          }
        />
      </label>
      <label>
        display_name:
        <input
          type="text"
          value={stateProfile?.display_name}
          onChange={(e) =>
            setStateProfile({ ...profile, display_name: e.target.value })
          }
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default ProfileForm;
