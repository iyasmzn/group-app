import { supabase } from '@/lib/supabase/client'
import { CoopSettings } from '@/types/coop'

export const coopSettingsService = {
  async getSettings(groupId: string) {
    return await supabase.from('group_coop_settings').select('*').eq('group_id', groupId).maybeSingle()
  },

  async updateSettings(groupId: string, settings: Partial<CoopSettings>) {
    return await supabase
      .from('group_coop_settings')
      .upsert({ group_id: groupId, ...settings })
      .select()
      .single()
  },
}
