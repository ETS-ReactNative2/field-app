import RadioGroup, { Radio } from "../radio_group";

const RoleListing = ({ color="blue", project, role, onSelect=()=>{}, disableSubmit=()=>{} }) => {
  useEffect(() => {
    role ? disableSubmit(false) : disableSubmit(true);
  }, [role]);

  const handleChange = (index) => {
    onSelect(project.projectRoles[index]);
  };

  return (
    <RadioGroup color={color} onChange={handleChange}>
      {project.projectRoles.map(({ id, name }) => (
        <Radio key={id} checked={role && role.id === id}>
          <Text>{name}</Text>
        </Radio>
      ))}
    </RadioGroup>
  );
}

export default RoleListing;
