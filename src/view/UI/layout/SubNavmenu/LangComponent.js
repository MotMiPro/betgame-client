import React from "react";
import { userChangeLocale } from "~/state/ducks/actions/session";
import { useDispatch, useSelector } from "react-redux";
import { languageList } from "~/settings/config";
import styled from "styled-components";

const SelectWrappPure = styled.select`
  background: transparent;
  border: none;
  outline: none;
`;

const LangManager = () => {
  const dispatch = useDispatch();
  const { locale } = useSelector((state) => state.sessionReducer);

  const handleSelectLanguage = (evt) => {
    const code = evt.target.value;
    dispatch(userChangeLocale(code));
    // window.location.reload();
  };

  return (
    <div>
      <span style={{ marginRight: 5 }}>
        <i className="fas fa-globe" />
      </span>
      <SelectWrappPure defaultValue={locale} onChange={handleSelectLanguage}>
        {languageList.map(({ label, code }, idx) => {
          return (
            <option key={idx} value={code}>
              {label}
            </option>
          );
        })}
      </SelectWrappPure>
    </div>
  );
};
export default React.memo(LangManager);
