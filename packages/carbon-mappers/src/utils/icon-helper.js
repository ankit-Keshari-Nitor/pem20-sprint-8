import { ButtonCentered, Txt, TextFill, Calendar, CheckboxCheckedFilled, RadioButtonChecked, ListDropdown, CharacterWholeNumber, Password, Upload } from '@carbon/icons-react';

export const getIconByType = (type) => {
  return {
    button: <ButtonCentered />,
    textarea: <TextFill />,
    textinput: <Txt />,
    datepicker: <Calendar />,
    checkbox: <CheckboxCheckedFilled />,
    radio: <RadioButtonChecked />,
    select: <ListDropdown />,
    numberinput: <CharacterWholeNumber />,
    password: <Password />,
    fileUploader: <Upload />,
    link: <Link />
  }[type];
};
