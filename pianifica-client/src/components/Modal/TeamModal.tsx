import Modal from "@/components/Modal";
import { useCreateTeamMutation, useEditTeamMutation, useGetCurrentUserQuery, useGetUsersQuery } from "@/state/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Dropdown from "../FormFields/dropdown";
import InputField from "../FormFields";
import type { Team } from "@/interface";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  team?: Team;
  action?: "add" | "edit";
};

const TeamModal = ({ isOpen, onClose, team, action = 'add' }: Props) => {
  const { data: user } = useGetCurrentUserQuery();
  const [manager, setManager] = useState(user?.data?.id || 0);
  const [lead, setLead] = useState(0);
  const [teamName, setTeamName] = useState("");
  const { data: users } = useGetUsersQuery({ limit: 100, page: 1 });

  useEffect(() => {
    if (team) {
      setTeamName(team.name || "");
      setManager(team.teamManager?.id || 0);
      setLead(team.teamLead?.id || 0);
    }
    else {
      setTeamName("");
      setManager(0);
      setLead(0);
    }
  }, [team, isOpen]);

  const handleSetTeamName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTeamName(e.target.value);
  }

  const handleSetManager = (value: string) => {
    setManager(Number(value));
  }

  const handleSetLead = (value: string) => {
    setLead(Number(value));
  }

  const [createTeam, { isLoading: isCreateLoading }] = useCreateTeamMutation();
  const [editTeam, { isLoading: isEditLoading }] = useEditTeamMutation();



  const userOptions = users?.data.map((user) => (
    { value: user?.id?.toString() || "", label: `${user.firstName} ${user.lastName}` || "", imgSrc: user.profilePictureUrl }
  )) || [];


  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }
    if (action === 'add') {
      const response = await createTeam({
        name: teamName,
        managerId: manager,
        leadId: lead,
      });

      if (response.error) {
        toast.error("An error occurred while adding user to team");
        return;
      }
      toast.success("User added to team successfully");
    }

    if (action === 'edit') {
      const response = await editTeam({
        id: team?.id,
        name: teamName,
        managerId: manager,
        leadId: lead,
      });

      if (response.error) {
        toast.error("An error occurred while adding user to team");
        return;
      }
      toast.success("User added to team successfully ");
    }
    onClose();
  };

  const isFormValid = () => {
    return manager && lead && teamName;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name="Add Team"
    >
      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {userOptions.length === 0 && (
          <p className="text-center text-red-600">No more users to add</p>
        )}
        <InputField
          label="Team Name"
          value={teamName.toString()}
          onChange={handleSetTeamName}
          placeholder="Enter team name"
        />
        <Dropdown
          options={userOptions}
          value={manager.toString()}
          setValue={handleSetManager}
          label="Team Manager"
          disabled={userOptions.length === 0}
        />
        <Dropdown
          options={userOptions}
          value={lead.toString()}
          setValue={handleSetLead}
          label="Team Lead"
          disabled={userOptions.length === 0}
        />

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || (isCreateLoading || isEditLoading) || userOptions.length === 0 ? "cursor-not-allowed opacity-50" : ""
            }`}
          disabled={!isFormValid() || (isCreateLoading || isEditLoading) || userOptions.length === 0}
        >
          {(isCreateLoading || isEditLoading) ? "Saving..." : action === 'add' ? "Add Team" : "Edit Team"}
        </button>
      </form>
    </Modal>
  );
};

export default TeamModal;
