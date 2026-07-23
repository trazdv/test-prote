/**
 * Mantiene sincronizado el vínculo de "adopción conjunta" entre dos animales:
 * si A se empareja con B, B también queda emparejado con A automáticamente
 * (y viceversa si se desvincula), sin que el admin tenga que editar los dos
 * animales a mano.
 */
export async function syncAnimalPairing({ supabase, animalId, oldPairedId, newPairedId }) {
  // Si tenía otro animal emparejado antes y ha cambiado, desvinculamos al antiguo.
  if (oldPairedId && oldPairedId !== newPairedId) {
    const { data: oldPartner } = await supabase
      .from('animals')
      .select('id, tags, paired_animal_id')
      .eq('id', oldPairedId)
      .single();

    if (oldPartner && oldPartner.paired_animal_id === animalId) {
      await supabase
        .from('animals')
        .update({
          paired_animal_id: null,
          tags: (oldPartner.tags || []).filter((t) => t !== 'Adopción conjunta'),
        })
        .eq('id', oldPairedId);
    }
  }

  // Vinculamos al nuevo animal emparejado, en los dos sentidos.
  if (newPairedId && newPairedId !== oldPairedId) {
    const { data: newPartner } = await supabase
      .from('animals')
      .select('id, tags')
      .eq('id', newPairedId)
      .single();

    if (newPartner) {
      const tags = newPartner.tags || [];
      await supabase
        .from('animals')
        .update({
          paired_animal_id: animalId,
          tags: tags.includes('Adopción conjunta') ? tags : [...tags, 'Adopción conjunta'],
        })
        .eq('id', newPairedId);
    }
  }
}
