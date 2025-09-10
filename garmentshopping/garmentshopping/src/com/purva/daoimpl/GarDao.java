package com.purva.daoimpl;

import java.util.List;

import com.purva.pojo.Garment;

public interface GarDao {
	
	boolean addGar(Garment g);
	boolean updateGar(Garment g);
    boolean	deleteGar(int GarId);
	Garment displayGarId(int GarId);
	List<Garment> displayAllGar();

}
