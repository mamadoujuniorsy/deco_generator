-- Migration: Update AI Provider from 'replicate' to 'homedesign'
-- This updates all existing designs that use 'replicate' to 'homedesign'

-- Update Design table
UPDATE `Design` 
SET `aiProvider` = 'homedesign' 
WHERE `aiProvider` = 'replicate';

-- Verify the changes
SELECT 
  aiProvider, 
  COUNT(*) as count 
FROM `Design` 
GROUP BY aiProvider;
