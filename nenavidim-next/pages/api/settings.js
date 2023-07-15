import {mongooseConnect} from "../../lib/mongoose"
import { Setting } from "../../models/Settings"
import {isAdminRequest} from "../api/auth/[...nextauth]"

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "PUT") {
    const { name, value } = req.body;
    const settingDoc = await Setting.findOne({ name });
    if (settingDoc) {
      settingDoc.value = value;
      await settingDoc.save();
      res.json(settingDoc);
    } else {
      res.json(await Setting.create({ name, value }));
    }
  }

  if (req.method === "GET") {
    const { name } = req.query;
    res.json(await Setting.findOne({ name }));
  }
}