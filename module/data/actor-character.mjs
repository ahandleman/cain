import CainActorBase from "./base-actor.mjs";

export default class CainCharacter extends CainActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.CAIN.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      });
      return obj;
    }, {}));

    schema.skills = new fields.SchemaField(Object.keys(CONFIG.CAIN.skills).reduce((obj, skill) => {
      obj[skill] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 3, min: 0, max: 3 }),
      });
      return obj;
    }, {}));

      // Add new string fields
      schema.sex = new fields.StringField({ required: true, blank: true });
      schema.height = new fields.StringField({ required: true, blank: true });
      schema.weight = new fields.StringField({ required: true, blank: true });
      schema.hair = new fields.StringField({ required: true, blank: true });
      schema.eyes = new fields.StringField({ required: true, blank: true });
      schema.agenda = new fields.StringField({ required: true, blank: true });
      schema.blasphemy = new fields.StringField({ required: true, blank: true });
      schema.XID = new fields.StringField({ required: true, blank: true });

          // Add XP and advancements fields
      schema.xp = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, min: 0, max: 4 }),
        max: new fields.NumberField({ required: true, initial: 4, min: 4, max: 4 }),
      });

      schema.advancements = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, max: 4 }),
        max: new fields.NumberField({ required: true, initial: 0, max: 4 }),
      });

      schema.scrip = new fields.NumberField({ required: true, initial: 0, min: 0, max: 1000 });
      
      schema.CATLEVEL = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, min: 0, max: 7 }),
      });

      schema.afflictions = new fields.SchemaField({
        affliction1: new fields.StringField({ required: true, blank: true }),
        affliction2: new fields.StringField({ required: true, blank: true }),
        affliction3: new fields.StringField({ required: true, blank: true }),
        affliction4: new fields.StringField({ required: true, blank: true }),
        affliction5: new fields.StringField({ required: true, blank: true }),
      });
      
      
      schema.divineAgony = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, min: 0, max: 3 }),
      });
      
      schema.injuries = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, min: 0, max: 3 }),
      });
      
      schema.stress = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, min: 0, max: 6 }),
      });

      schema.extraDice = new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 0, min: 0, max: 6 }),
      });

      // Define the Talisman Schema
      schema.talismans = new fields.ArrayField(
         new fields.ObjectField({
          name: new fields.StringField({ required: true }),
          imagePath: new fields.StringField({ required: true }),
          currMarkAmount: new fields.NumberField({ required: true, initial: 0, min: 0 }),
          minMarkAmount: new fields.NumberField({ required: true, initial: 0, min:  0 }),
          maxMarkAmount: new fields.NumberField({ required: true, initial: 6, min:  0}),
        }),
        { required: true, initial: [{name: "Execution", imagePath: "systems/cain/assets/Talismans/Talisman-A-0.png", currMarkAmount: 0, minMarkAmount: 0, maxMarkAmount: 6}] }
      );

    return schema;


  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.CAIN.abilities[key]) ?? key;
    }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;

    return data
  }

    // Method to handle XP and advancements
    handleXP() {
      if (this.xp >= 4) {
        this.xp = 0;
        this.advancements += 1;
      }
    }

}