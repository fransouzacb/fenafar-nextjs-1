import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔐 Tentando login:', { email })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('✅ Resposta Supabase:', { data: !!data.user, error: error?.message })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    if (data.user && data.session) {
      console.log('🎯 User data:', {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
        role: data.user.user_metadata?.role
      })
      
      console.log('🎫 Session data:', {
        access_token: data.session.access_token ? 'EXISTS' : 'MISSING',
        expires_at: data.session.expires_at
      })

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        },
        session: {
          access_token: data.session.access_token,
          expires_at: data.session.expires_at
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'No user or session returned'
    }, { status: 400 })

  } catch (error) {
    console.error('❌ Erro no test-auth:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}