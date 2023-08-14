import React, { useMemo } from "react";

export default function AmountUI(props) {
  const { data } = props;
  return (
    <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}>
      <span>{data?.amount}</span>
      <span style={{ marginLeft: 5, fontSize: 13, fontWeight: 600 }}>
        {data?.currency}
      </span>
    </div>
  );
}

export const UsersUI = (props) => {
  const { user } = props;
  if (!user) return null;
  const userString = useMemo(() => {
    return subNameCode(user);
  }, [user]);
  return <span>{userString}</span>;
};

export const subNameCode = (name) => {
  if (!name) return;
  return name?.length > 3
    ? `${name.substr(0, 3)}***`
    : `${name.substr(0, 2)}***`;
};
