import { BottomSheet } from '@shared/ui/BottomSheet'
import { AddTransactionForm } from '@features/add-transaction'
import { useCreateTransactionMutation } from '@entities/transaction'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [createTransaction] = useCreateTransactionMutation()

  const handleSubmit = async (data: any) => {
    try {
      await createTransaction({
        type: data.type,
        amount: data.amount,
        currency: 'TJS',
        categoryId: data.categoryId,
        accountId: data.accountId,
        date: data.date,
        place: data.place,
        person: data.person,
        debtSubType: data.debtSubType,
        comment: data.comment,
      }).unwrap()

      onClose()
    } catch (error) {
      console.error('Failed to create transaction:', error)
      alert('Ошибка при создании транзакции')
    }
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить транзакцию"
    >
      <AddTransactionForm onSubmit={handleSubmit} />
    </BottomSheet>
  )
}

