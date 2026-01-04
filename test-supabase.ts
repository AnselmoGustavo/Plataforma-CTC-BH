import { supabase } from './src/integrations/supabase/client';

async function testSupabaseConnection() {
  console.log('🧪 Testando conexão com Supabase...\n');

  try {
    // Test 1: Check connection
    console.log('1️⃣ Testando conexão básica...');
    const { data: tables, error: tablesError } = await supabase
      .from('associados')
      .select('count');
    
    if (tablesError) throw tablesError;
    console.log('✅ Conexão estabelecida!\n');

    // Test 2: List tables
    console.log('2️⃣ Testando leitura de dados...');
    const { data: associados, error: associadosError } = await supabase
      .from('associados')
      .select('*')
      .limit(5);
    
    if (associadosError) throw associadosError;
    console.log(`✅ Encontrados ${associados?.length || 0} associados`);
    console.log(associados);
    console.log('');

    // Test 3: Auth check
    console.log('3️⃣ Testando autenticação...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log(`✅ Auth status: ${session ? 'Logado' : 'Não logado'}\n`);

    console.log('🎉 Todos os testes passaram!');
    console.log('\n📊 Resumo:');
    console.log('- Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('- Tabelas acessíveis: ✅');
    console.log('- Auth configurado: ✅');

  } catch (error: any) {
    console.error('❌ Erro nos testes:', error.message);
    console.error('Detalhes:', error);
  }
}

// Run tests
testSupabaseConnection();
