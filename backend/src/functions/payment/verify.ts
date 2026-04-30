import axios from 'axios'
import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { db, Tables } from '../../lib/db/client'
import { v4 as uuid } from 'uuid'

export async function handler(event) {
  try {
    const reference = event.queryStringParameters?.reference

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    )

    const data = response.data.data

    if (data.status !== 'success') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Payment not successful' })
      }
    }

    // 🔥 Retrieve election data from metadata
    const { electionData, org_id } = data.metadata

    const now = new Date().toISOString()

    const election = {
      election_id: uuid(),
      org_id,
      title: electionData.title,
      description: electionData.description,
      type: electionData.type,
      status: 'DRAFT',
      created_at: now,
      updated_at: now,
    }

    await db.send(new PutCommand({
      TableName: Tables.ELECTIONS,
      Item: election
    }))

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Election created successfully' })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }
}