# [HEOI2015]小Z的房间
[BZOJ4031 Luogu4111]

你突然有了一个大房子，房子里面有一些房间。事实上，你的房子可以看做是一个包含n*m个格子的格状矩形，每个格子是一个房间或者是一个柱子。在一开始的时候，相邻的格子之间都有墙隔着。  
你想要打通一些相邻房间的墙，使得所有房间能够互相到达。在此过程中，你不能把房子给打穿，或者打通柱子（以及柱子旁边的墙）。同时，你不希望在房子中有小偷的时候会很难抓，所以你希望任意两个房间之间都只有一条通路。现在，你希望统计一共有多少种可行的方案。

矩阵树定理。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

const int maxMap=10;
const int maxN=maxMap*maxMap;
const int Mod=1e9;
const int inf=2147483647;

int n,m,idcnt;
char Input[maxMap][maxMap];
int Mat[maxN][maxN],Id[maxMap][maxMap];

int Guass();

int main()
{
	scanf("%d%d",&n,&m);
	for (int i=1;i<=n;i++) scanf("%s",Input[i]+1);

	idcnt=0;
	for (int i=1;i<=n;i++) for (int j=1;j<=m;j++) if (Input[i][j]=='.') Id[i][j]=++idcnt;

	for (int i=1;i<=n;i++)
		for (int j=1;j<=m;j++)
			if (Input[i][j]=='.')
			{
				if (Input[i-1][j]=='.') Mat[Id[i][j]][Id[i][j]]++,Mat[Id[i][j]][Id[i-1][j]]--;
				if (Input[i][j-1]=='.') Mat[Id[i][j]][Id[i][j]]++,Mat[Id[i][j]][Id[i][j-1]]--;
				if (Input[i+1][j]=='.') Mat[Id[i][j]][Id[i][j]]++,Mat[Id[i][j]][Id[i+1][j]]--;
				if (Input[i][j+1]=='.') Mat[Id[i][j]][Id[i][j]]++,Mat[Id[i][j]][Id[i][j+1]]--;
			}
	printf("%d\n",Guass());
	return 0;
}

int Guass()
{
	int Ans=1;
	for (int i=1;i<idcnt;i++)
	{
		for (int j=i+1;j<idcnt;j++)
			while (Mat[j][i])
			{
				int p=Mat[i][i]/Mat[j][i];
				for (int k=i;k<idcnt;k++)
					Mat[i][k]=(Mat[i][k]-1ll*Mat[j][k]*p%Mod+Mod)%Mod;
				swap(Mat[i],Mat[j]);
				Ans=-Ans;
			}
		Ans=1ll*Ans*Mat[i][i]%Mod;
	}
	return (Ans+Mod)%Mod;
}
```