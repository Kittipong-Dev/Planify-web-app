// Member.js (React Component)
import React from 'react';
import '/styles/member.css';

const Member = ({ members, onMemberSelect, isVisible, selectedMember }) => {
  if (!isVisible) return null;

  const handleMemberClick = (member) => {
    onMemberSelect(member);
  };

  return (
    <div className="member-popup-overlay">
      <div className="member-popup">
        <div className="member-options">
          {members.map?members.map((member) => (
            <div
              key={member.id}
              className={(selectedMember?selectedMember.id==member.id:false)?"member-option selected-member-option":"member-option"}
              onClick={() => handleMemberClick(member)}
            >
              {/* bad practise but i dont have time*/}
              <img
                src={member.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`}
                alt={member.name}
                className="member-profile-picture"
              />
              <span className="member-username">{member.name}</span>
            </div>
          )):<div>{JSON.stringify(members)}</div>}
        </div>
      </div>
    </div>
  );
};

export default Member;
