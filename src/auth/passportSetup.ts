import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ParticipantsService } from "../services/participants.js";

const participantService = new ParticipantsService();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const google_id = profile.id;
        const participant_name =
          profile._json.given_name + " " + profile._json.family_name;
        const email = profile.emails?.[0]?.value ?? "";

        const { participant } =
          await participantService.findOrCreateParticipant({
            google_id,
            participant_name,
            email,
          });

        if (!participant) {
          return done(new Error("Failed to create participant"));
        }
        done(null, participant.id);
      } catch (error) {
        done(error);
      }
    },
  ),
);

// passport.serializeUser((participantId, done) => done(null, participantId));
// passport.deserializeUser(async (participantId: number, done) => {
//   try {
//     const service = new ParticipantsService();
//     const result = await service.findParticipantWithID({ id: participantId });
//     done(null, result.participant);
//   } catch (err) {
//     done(err);
//   }
// });
