import { PetRegistrationForm } from '@/components/shared/pet-registration-form/pet-registration-form'

function HomePage() {
  return <PetRegistrationForm viewAs="guest" action="create" />
}

export default HomePage
