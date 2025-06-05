import { PetRegistrationForm } from '@/components/shared/pet-registration-form/pet-registration-form'

function CreatePetPage() {
  return <PetRegistrationForm action="create" viewAs="authenticated" />
}

export default CreatePetPage
