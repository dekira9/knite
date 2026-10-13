create or replace function public.calculate_raglan_core(
  p_head_circumference text,
  p_neck_circumference text,
  p_chest_circumference text,
  p_stitch_density text,
  p_row_density text,
  p_fit_type text,
  p_ribbing_width numeric,
  p_ribbing_width_v numeric,
  p_raglan_line_width integer,
  p_raglan_line_width_v integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_head numeric := replace(p_head_circumference, ',', '.')::numeric;
  v_neck numeric := replace(p_neck_circumference, ',', '.')::numeric;
  v_chest numeric := replace(p_chest_circumference, ',', '.')::numeric;
  v_stitches numeric := replace(p_stitch_density, ',', '.')::numeric / 10;
  v_rows numeric := replace(p_row_density, ',', '.')::numeric / 10;
  v_fit numeric := 0;
  v_pi numeric := pi();
  v_dr numeric;
  v_lgor numeric;
  v_lgor_v numeric;
  v_sgor integer;
  v_sgor_v integer;
  v_nrrez integer;
  v_nrrez_v integer;
  v_sfront_o integer;
  v_sfront_v integer;
  v_skfront integer;
  v_skfront_v integer;
  v_sfit integer;
  v_sogr integer;
  v_spodr integer;
  v_sfront_ogr integer;
  v_sfront_ogr_v integer;
  v_sfx integer;
  v_sfx_v integer;
  v_hfront_sm numeric;
  v_hfront_sm_v numeric;
  v_nhfront integer;
  v_nhfront_v integer;
  v_sa integer;
  v_sa_v integer;
begin
  if p_fit_type = 'semi-fitted' then
    v_fit := round(2 * v_stitches) / v_stitches;
  elsif p_fit_type = 'loose' then
    v_fit := round(6 * v_stitches) / v_stitches;
  elsif p_fit_type = 'oversized' then
    v_fit := round(10 * v_stitches) / v_stitches;
  end if;

  v_dr := (v_head - v_neck) / (2 * v_pi);
  v_lgor := case when p_ribbing_width <= v_dr then (v_head - v_pi * p_ribbing_width) else (v_neck + v_pi * p_ribbing_width) end;
  v_lgor_v := case when p_ribbing_width_v <= v_dr then (v_head - v_pi * p_ribbing_width_v) else (v_neck + v_pi * p_ribbing_width_v) end;

  v_nrrez := round(p_ribbing_width * v_rows);
  v_nrrez_v := round(p_ribbing_width_v * v_rows / 2) * 2;
  v_sgor := round((v_lgor * v_stitches) / 2) * 2;
  v_sgor_v := round((v_lgor_v * v_stitches) / 2) * 2;
  v_sfront_o := round(((v_sgor - 4 * p_raglan_line_width) / 8 * 3) / 2) * 2;
  v_sfront_v := round(((v_sgor_v - 4 * p_raglan_line_width_v) / 8 * 3) / 2) * 2;

  v_skfront := round(
    (
      case
        when mod(p_raglan_line_width, 2) = 0 then p_raglan_line_width::numeric / (2 * v_stitches)
        else ((p_raglan_line_width::numeric / 2) + 0.5) / v_stitches
      end
    ) * v_stitches
  );
  v_skfront_v := round(
    (
      case
        when mod(p_raglan_line_width_v, 2) = 0 then p_raglan_line_width_v::numeric / (2 * v_stitches)
        else ((p_raglan_line_width_v::numeric / 2) + 0.5) / v_stitches
      end
    ) * v_stitches
  );

  v_sfit := round(v_fit * v_stitches / 2) * 2;
  v_sogr := round(v_chest * v_stitches / 2) * 2;
  v_spodr := round((v_sogr * 0.08) / 2) * 2;
  v_sfront_ogr := round((v_sogr - 4 * v_skfront - 2 * v_spodr + v_sfit) / 4) * 2;
  v_sfront_ogr_v := round((v_sogr - 4 * v_skfront_v - 2 * v_spodr + v_sfit) / 4) * 2;

  v_sfx := round((v_sfront_ogr - v_sfront_o) / 2);
  v_sfx_v := round((v_sfront_ogr_v - v_sfront_v) / 2);
  v_sa := (v_sgor - 2 * v_sfront_o - 4 * p_raglan_line_width) / 2;
  v_sa_v := (v_sgor_v - 2 * v_sfront_v - 4 * p_raglan_line_width_v) / 2;

  v_hfront_sm := ((v_chest + v_fit) / 6 + 5) - p_ribbing_width;
  v_hfront_sm_v := ((v_chest + v_fit) / 6 + 5) - p_ribbing_width_v;
  v_nhfront := round((v_hfront_sm * v_rows) / 2) * 2;
  v_nhfront_v := round((v_hfront_sm_v * v_rows) / 2) * 2;

  return jsonb_build_object(
    'Sgor', v_sgor,
    'SgorV', v_sgor_v,
    'NRrez', v_nrrez,
    'NRrezV', v_nrrez_v,
    'SFrontO', v_sfront_o,
    'SFrontV', v_sfront_v,
    'SPodr', v_spodr,
    'Sfx', v_sfx,
    'SfxV', v_sfx_v,
    'NHFront', v_nhfront,
    'NHFrontV', v_nhfront_v,
    'Sa', v_sa,
    'SaV', v_sa_v,
    'SKfront', v_skfront,
    'SKfrontV', v_skfront_v,
    'SFrontOGr', v_sfront_ogr,
    'SFrontOGrV', v_sfront_ogr_v
  );
end;
$$;

revoke all on function public.calculate_raglan_core(
  text, text, text, text, text, text, numeric, numeric, integer, integer
) from public;

grant execute on function public.calculate_raglan_core(
  text, text, text, text, text, text, numeric, numeric, integer, integer
) to anon, authenticated;

