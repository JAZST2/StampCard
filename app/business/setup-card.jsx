import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Switch, View } from 'react-native'
import AppText from '../../components/atoms/AppText'
import AppInput from '../../components/atoms/AppInput'
import AppButton from '../../components/atoms/AppButton'
import { colors, spacing, radius } from '../../constants/theme'
import {
  createStampCard,
  createStampMilestone,
} from '../../services/business.service'

export default function SetupCardScreen() {
  const [businessId, setBusinessId] = useState('')
  const [cardName, setCardName] = useState('')
  const [totalStamps, setTotalStamps] = useState('')
  const [cardError, setCardError] = useState('')
  const [cardSuccess, setCardSuccess] = useState('')
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [createdCard, setCreatedCard] = useState(null)

  const [stampCount, setStampCount] = useState('')
  const [rewardDescription, setRewardDescription] = useState('')
  const [isClaimable, setIsClaimable] = useState(true)
  const [milestoneError, setMilestoneError] = useState('')
  const [milestoneSuccess, setMilestoneSuccess] = useState('')
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [milestones, setMilestones] = useState([])

  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => a.stamp_count - b.stamp_count),
    [milestones]
  )

  const validateCardForm = () => {
    const parsedTotalStamps = Number(totalStamps)

    if (!businessId.trim()) return 'Business ID is required'
    if (!cardName.trim()) return 'Card name is required'
    if (!Number.isInteger(parsedTotalStamps) || parsedTotalStamps <= 0) {
      return 'Total stamps must be a whole number greater than 0'
    }

    return ''
  }

  const validateMilestoneForm = () => {
    if (!createdCard?.id) return 'Create a card first before adding milestones'

    const parsedStampCount = Number(stampCount)
    const parsedTotalStamps = Number(createdCard.total_stamps)

    if (!Number.isInteger(parsedStampCount) || parsedStampCount <= 0) {
      return 'Stamp count must be a whole number greater than 0'
    }
    if (parsedStampCount > parsedTotalStamps) {
      return `Stamp count cannot exceed total stamps (${parsedTotalStamps})`
    }
    if (!rewardDescription.trim()) return 'Reward description is required'

    const isDuplicate = milestones.some(
      (item) => item.stamp_count === parsedStampCount
    )
    if (isDuplicate) return 'Duplicate milestone stamp count is not allowed'

    return ''
  }

  const handleCreateCard = async () => {
    setCardSuccess('')
    setCardError('')

    const validationError = validateCardForm()
    if (validationError) {
      setCardError(validationError)
      return
    }

    try {
      setIsCreatingCard(true)
      const card = await createStampCard({
        businessId: businessId.trim(),
        name: cardName.trim(),
        totalStamps: Number(totalStamps),
      })
      setCreatedCard(card)
      setMilestones([])
      setCardSuccess('Card created successfully. You can now add milestones.')
    } catch (error) {
      setCardError(error?.message ?? 'Failed to create card')
    } finally {
      setIsCreatingCard(false)
    }
  }

  const handleAddMilestone = async () => {
    setMilestoneError('')
    setMilestoneSuccess('')

    const validationError = validateMilestoneForm()
    if (validationError) {
      setMilestoneError(validationError)
      return
    }

    try {
      setIsAddingMilestone(true)
      const createdMilestone = await createStampMilestone({
        stampCardId: createdCard.id,
        stampCount: Number(stampCount),
        rewardDescription: rewardDescription.trim(),
        isClaimable,
      })

      setMilestones((prev) => [...prev, createdMilestone])
      setStampCount('')
      setRewardDescription('')
      setIsClaimable(true)
      setMilestoneSuccess('Milestone added successfully.')
    } catch (error) {
      setMilestoneError(error?.message ?? 'Failed to add milestone')
    } finally {
      setIsAddingMilestone(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <AppText variant="h3">Create Stamp Card</AppText>
        <AppText variant="caption" style={styles.subtitle}>
          Phase 1: Create the card first.
        </AppText>

        <AppInput
          value={businessId}
          onChangeText={setBusinessId}
          placeholder="Business ID (UUID)"
          style={styles.input}
        />
        <AppInput
          value={cardName}
          onChangeText={setCardName}
          placeholder="Card Name (e.g. Coffee Card)"
          style={styles.input}
        />
        <AppInput
          value={totalStamps}
          onChangeText={setTotalStamps}
          placeholder="Total Stamps (e.g. 10)"
          keyboardType="number-pad"
          style={styles.input}
        />

        {cardError ? <AppText variant="error">{cardError}</AppText> : null}
        {cardSuccess ? (
          <AppText variant="caption" style={styles.success}>
            {cardSuccess}
          </AppText>
        ) : null}

        <AppButton
          label="Create Card"
          onPress={handleCreateCard}
          loading={isCreatingCard}
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="h3">Add Milestones</AppText>
        <AppText variant="caption" style={styles.subtitle}>
          Phase 2: Add rewards to the created card.
        </AppText>

        <AppInput
          value={stampCount}
          onChangeText={setStampCount}
          placeholder="Stamp Count (e.g. 5)"
          keyboardType="number-pad"
          style={styles.input}
        />
        <AppInput
          value={rewardDescription}
          onChangeText={setRewardDescription}
          placeholder="Reward Description"
          style={styles.input}
        />

        <View style={styles.switchRow}>
          <AppText variant="body">Claimable reward</AppText>
          <Switch value={isClaimable} onValueChange={setIsClaimable} />
        </View>

        {milestoneError ? (
          <AppText variant="error">{milestoneError}</AppText>
        ) : null}
        {milestoneSuccess ? (
          <AppText variant="caption" style={styles.success}>
            {milestoneSuccess}
          </AppText>
        ) : null}

        <AppButton
          label="Add Milestone"
          onPress={handleAddMilestone}
          loading={isAddingMilestone}
          disabled={!createdCard?.id}
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="h3">Preview</AppText>
        {!createdCard ? (
          <AppText variant="caption">No card created yet.</AppText>
        ) : (
          <View style={styles.previewBox}>
            <AppText variant="body">Card: {createdCard.name}</AppText>
            <AppText variant="caption">
              Total Stamps: {createdCard.total_stamps}
            </AppText>
            <AppText variant="caption">Card ID: {createdCard.id}</AppText>
          </View>
        )}

        <View style={styles.milestoneList}>
          {sortedMilestones.length === 0 ? (
            <AppText variant="caption">No milestones yet.</AppText>
          ) : (
            sortedMilestones.map((item) => (
              <View key={item.id} style={styles.milestoneItem}>
                <AppText variant="body">{item.stamp_count} stamps</AppText>
                <AppText variant="caption">{item.reward_description}</AppText>
                <AppText variant="muted">
                  {item.is_claimable ? 'Claimable' : 'Not claimable'}
                </AppText>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    gap: spacing.lg,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.sm,
  },
  input: {
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.sm,
  },
  success: {
    color: colors.success,
  },
  switchRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  milestoneList: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  milestoneItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
})
